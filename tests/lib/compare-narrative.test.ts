// vs pages (commercial intent review, suburbs-market 0.4 and 3.9, 10 Oct
// 2026): no "+0.0%" where nothing is measured, and "% cheaper" as a share of
// the dearer suburb's median, the same in either URL order.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import type { Suburb } from "@/types";
import {
  buildCompareFaqs,
  buildCompareIntro,
  buildCompareMetaDescription,
  buildCompareVerdicts,
  cheaperByPercent,
} from "@/lib/compare-narrative";

function suburb(name: string, postcode: string, state: string, salesSource: string | null, medianHousePrice: number, annualGrowthHouse = 0): Suburb {
  return {
    id: name, slug: `${name.toLowerCase().replace(/ /g, "-")}-${state.toLowerCase()}-${postcode}`, name, postcode, state, region: "", description: "", heroImage: "",
    schools: [], amenities: [], transportLinks: [], nearbySuburbs: [],
    stats: {
      medianHousePrice, medianUnitPrice: 0, medianRentHouse: 0, medianRentUnit: 0, annualGrowthHouse, annualGrowthUnit: 0, daysOnMarket: 0,
      population: 0, medianAge: 0, ownerOccupied: 0, renterOccupied: 0, householdsFamily: 0, householdsLonePerson: 0, walkScore: null, transitScore: null, bikeScore: null,
    },
    dataFreshness: {
      rentalAsOf: null, rentalSource: null, crimeAsOf: null, crimeSource: null,
      salesAsOf: new Date("2026-05-15T00:00:00Z"), salesSource, salesCount: null, salesPeriodEnd: null,
      censusAsOf: null, hazardAsOf: null, walkabilityAsOf: null, climateAsOf: null,
    },
    hazard: null, climate: null,
  } as Suburb;
}

// Live on 10 Oct 2026: Frankston $810,000, Frankston North $670,000 (Land Victoria).
const frankston = () => suburb("Frankston", "3199", "VIC", "sales-vic", 810_000);
const frankstonNorth = () => suburb("Frankston North", "3200", "VIC", "sales-vic", 670_000);

describe("% cheaper is (dearer - cheaper) / dearer", () => {
  it("Frankston North is 17% cheaper than Frankston, not 21%", () => {
    expect(cheaperByPercent(810_000, 670_000)).toBeCloseTo(17.28, 2);
    expect(cheaperByPercent(670_000, 810_000)).toBeCloseTo(17.28, 2);
    expect(cheaperByPercent(0, 670_000)).toBeNull();
    expect(cheaperByPercent(810_000, 0)).toBeNull();
  });

  it("the meta description, the intro, the buyer verdict and the FAQ print the same gap in either URL order", () => {
    for (const [a, b] of [[frankston(), frankstonNorth()], [frankstonNorth(), frankston()]]) {
      expect(buildCompareMetaDescription(a, b)).toMatch(/^Frankston North is roughly 17% cheaper\./);
      expect(buildCompareMetaDescription(a, b).length).toBeLessThanOrEqual(160);
      expect(buildCompareIntro(a, b)[0]).toMatch(/Frankston North \(median \$670,000\) is roughly 17% cheaper to buy into than Frankston \(\$810,000\)\./);
      expect(buildCompareVerdicts(a, b).forBuyers).toMatch(/17% below the other suburb/);
      const faq = buildCompareFaqs(a, b).find((f) => /cheaper/.test(f.question));
      expect(faq?.answer).toMatch(/roughly 17% below Frankston/);
      for (const text of [buildCompareMetaDescription(a, b), ...buildCompareIntro(a, b), buildCompareVerdicts(a, b).forBuyers]) {
        expect(text).not.toMatch(/21%/);
      }
    }
  });
});

describe("growth is compared only where both changes were measured", () => {
  it("two Land Victoria medians: no growth sentence, FAQ or claim (Land Victoria publishes no change)", () => {
    const a = frankston();
    const b = frankstonNorth();
    a.stats.annualGrowthHouse = 4; // a leftover the feed never wrote
    const all = [buildCompareMetaDescription(a, b), ...buildCompareIntro(a, b), buildCompareVerdicts(a, b).forInvestors, ...buildCompareFaqs(a, b).map((f) => `${f.question} ${f.answer}`)].join(" ");
    expect(all).not.toMatch(/0\.0%|\+4|ahead on 12-month growth|percentage points ahead|stronger property growth|faster on (12-month )?capital growth/i);
  });

  it("a measured change against an unmeasured one: no comparison", () => {
    const nsw = suburb("Hurstville", "2220", "NSW", "sales-nsw", 1_500_000, 5.2);
    const vic = suburb("Glen Waverley", "3150", "VIC", "sales-vic", 1_640_000);
    expect(buildCompareFaqs(nsw, vic).some((f) => /growth/i.test(f.question))).toBe(false);
    expect(buildCompareMetaDescription(nsw, vic)).not.toMatch(/growth/);
  });

  it("two measured changes (NSW): compared, with the published figures", () => {
    const a = suburb("Hurstville", "2220", "NSW", "sales-nsw", 1_500_000, 5.2);
    const b = suburb("South Hurstville", "2221", "NSW", "sales-nsw", 1_800_000, 3.1);
    expect(buildCompareIntro(a, b)[0]).toMatch(/Hurstville \(\+5\.2%\) ran 2\.1 percentage points ahead of South Hurstville \(\+3\.1%\)/);
    expect(buildCompareMetaDescription(a, b)).toMatch(/Hurstville runs 2\.1 points ahead on 12-month growth/);
  });

  it("withheld medians (the 1 Oct NSW label): no price or growth claim at all", () => {
    const a = suburb("Hurstville", "2220", "NSW", "rental-nsw", 0, 0);
    const b = suburb("South Hurstville", "2221", "NSW", "rental-nsw", 0, 0);
    expect(buildCompareMetaDescription(a, b)).toBe("Compare Hurstville and South Hurstville side-by-side: schools, walkability, climate, risk and more. Free, no sign-up.");
    expect(buildCompareIntro(a, b)).toEqual([]);
  });
});

describe("the vs template", () => {
  const page = fs.readFileSync("src/app/(marketing)/suburbs/[slug]/vs/[compareSlug]/page.tsx", "utf8");
  it("prints growth only through publishedGrowthFor, never from the raw column", () => {
    expect(page).toContain("const growthA = publishedGrowthFor(suburbA);");
    expect(page).not.toMatch(/annualGrowthHouse/);
    expect(page).toMatch(/\{growth !== 0 && \(/);
    expect(page).toMatch(/\{\(growthA !== 0 \|\| growthB !== 0\) && \(/);
  });
  it("links each profile's price section with a price anchor where the median is published", () => {
    expect(page).toContain("`/suburbs/${s}#market`");
    expect(page).toContain("`${suburb.name} median house price`");
  });
});
