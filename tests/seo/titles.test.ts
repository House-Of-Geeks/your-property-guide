// R6 of the September 2026 fix review: every title builder stays inside the
// SERP budget before the " | Your Property Guide" suffix, and no description
// prints a dollar figure for a suburb whose price fails the reliability gate.
//
// Why 60: Google truncates titles at roughly 600px, which is 55–65 characters
// of mixed-case text. The root layout appends " | Your Property Guide" (22
// chars) on top of whatever these builders return, so anything over 60 here is
// guaranteed to be cut or rewritten in results (see the search review: the
// current suburb title is shown as "Morayfield Postcode 4506 (QLD) - Suburbs").
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
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
import path from "node:path";
import { ABBR, AUSTRALIAN_STATES, STAMP_DUTY_GUIDES, dutyFor, money, stampDutyMetaTitle, stampDutyTitle } from "@/lib/data/stamp-duty-state";
import { SITE_NAME } from "@/lib/constants";

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
      salesAsOf: new Date("2026-06-30"), salesSource, salesCount: null, salesPeriodEnd: null,
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
    expect(builder).toMatch(/title: g\.title,/);
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
