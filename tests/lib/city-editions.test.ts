// The best-suburbs city editions (review of 30 Sep 2026, section 3.6,
// tracker item 22): which pages exist, what makes one indexable, which
// suburbs belong to a city, and what the copy promises.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  CITY_EDITION_CATEGORIES,
  CITY_EDITION_POOL,
  CITY_EDITION_SIZE,
  cityEditionDescription,
  cityEditionFaqs,
  cityEditionH1,
  cityEditionLede,
  cityEditionMethod,
  cityEditionPath,
  cityEditionTitle,
  PRICE_RANKED_CATEGORIES,
  hasCityEdition,
  isCityEditionCategory,
  isCityEditionIndexable,
  noEditionReason,
  isNumbered,
  metricSummary,
  showUnderBudget,
  suburbParagraph,
  tiedAtCap,
  underBudget,
  type CityEdition,
  type CityEditionSuburb,
} from "@/lib/city-editions";
import { CAPITAL_CITIES, capitalCityFor, cityPostcodeSql, cityPostcodeWhere, distanceKm, getCapitalCity, kmToCbd } from "@/lib/utils/metro";
import { GROWTH_RANKED_STATES, YIELD_RANKED_STATES, isRanked, type RankingCategory } from "@/lib/ranking-notes";

const read = (f: string) => fs.readFileSync(f, "utf8");
const brisbane = getCapitalCity("brisbane")!;
const sydney = getCapitalCity("sydney")!;
const perth = getCapitalCity("perth")!;

function suburb(over: Partial<CityEditionSuburb>): CityEditionSuburb {
  return {
    slug: "morayfield-qld-4506", name: "Morayfield", state: "QLD", postcode: "4506",
    medianHousePrice: 660_000, medianUnitPrice: 0, annualGrowthHouse: 0, medianBasis: "area",
    population: 25_000, householdsFamily: 62, walkScore: 40, avgSchoolIcsea: 980, schoolCount: 6,
    medianRentHouse: 520, rentPeriod: new Date("2026-06-30T00:00:00Z"), rentSource: "rental-qld", grossRentalYield: 4.1,
    kmToCbd: 40, ...over,
  };
}

/** A pool of `count` rows in ranking order, each distinct. */
function pool(count: number, over: (i: number) => Partial<CityEditionSuburb>): CityEditionSuburb[] {
  return Array.from({ length: count }, (_, i) => suburb({ slug: `s${i}-qld-4${String(i).padStart(3, "0")}`, name: `Suburb ${i + 1}`, postcode: `4${String(i).padStart(3, "0")}`, ...over(i) }));
}

function edition(category: RankingCategory, city = brisbane, count = CITY_EDITION_POOL, over: (i: number) => Partial<CityEditionSuburb> = () => ({})): CityEdition {
  return { category, city, suburbs: pool(count, over), eligible: 120, salesPeriod: city.state === "NSW" ? "calendar 2025" : "2024" };
}

const words = (s: string) => s.trim().split(/\s+/).length;

describe("which pages are city editions", () => {
  it("five categories, never flood risk (no hazard data, tracker item 49)", () => {
    expect([...CITY_EDITION_CATEGORIES]).toEqual(["best-rental-yield", "highest-growth", "for-families", "most-affordable", "most-walkable"]);
    expect(isCityEditionCategory("lowest-flood-risk")).toBe(false);
    expect(isCityEditionCategory("best-rental-yield")).toBe(true);
  });
  it("is indexable only with ten suburbs, in a state where the category is ranked", () => {
    const wide = { pool: 300, suburbs: 400 };
    for (const c of CITY_EDITION_CATEGORIES) {
      for (const city of CAPITAL_CITIES) {
        expect(hasCityEdition(c, city.state, CITY_EDITION_SIZE - 1, wide), `${c} ${city.slug} nine`).toBe(false);
        expect(hasCityEdition(c, city.state, 0, wide), `${c} ${city.slug} none`).toBe(false);
        expect(hasCityEdition(c, city.state, CITY_EDITION_SIZE, wide), `${c} ${city.slug} ten`).toBe(isRanked(c, city.state));
        expect(hasCityEdition(c, city.state, CITY_EDITION_POOL, wide), `${c} ${city.slug} fifteen`).toBe(isRanked(c, city.state));
      }
    }
    // yield only where a rent is measured for the suburb, growth only where a change is measured
    expect(CAPITAL_CITIES.filter((c) => hasCityEdition("best-rental-yield", c.state, 10, wide)).map((c) => c.slug)).toEqual(["melbourne", "brisbane"]);
    expect(CAPITAL_CITIES.filter((c) => hasCityEdition("highest-growth", c.state, 10, wide)).map((c) => c.slug)).toEqual(["sydney", "adelaide"]);
    expect(CAPITAL_CITIES.filter((c) => hasCityEdition("best-rental-yield", c.state, 10, wide)).map((c) => c.state)).toEqual([...YIELD_RANKED_STATES]);
    expect(CAPITAL_CITIES.filter((c) => hasCityEdition("highest-growth", c.state, 10, wide)).map((c) => c.state)).toEqual([...GROWTH_RANKED_STATES]);
    expect(hasCityEdition("lowest-flood-risk", "QLD", 50, wide)).toBe(false);
  });
  it("a price ranking needs a pool that stands for the city (review of 10 Oct 2026, 0.2b)", () => {
    for (const c of PRICE_RANKED_CATEGORIES) {
      const state = c === "highest-growth" ? "SA" : "VIC";
      // no count, no edition: the page and the sitemap always pass one
      expect(hasCityEdition(c, state, 15), c).toBe(false);
      // Brisbane on 10 Oct 2026: 17 of 196 suburbs of 1,000 or more residents
      expect(hasCityEdition(c, state, 15, { pool: 17, suburbs: 196 }), c).toBe(false);
      // Hobart: 25 of 30 is a large share but too few suburbs
      expect(hasCityEdition(c, state, 15, { pool: 25, suburbs: 30 }), c).toBe(false);
      // Perth's 66 ABS medians of about 280 suburbs clear it; Adelaide's 259 easily
      expect(hasCityEdition(c, state, 15, { pool: 66, suburbs: 280 }), c).toBe(true);
      expect(hasCityEdition(c, state, 15, { pool: 259, suburbs: 300 }), c).toBe(true);
    }
    // the rankings on something other than price need no count
    expect(hasCityEdition("for-families", "QLD", 15)).toBe(true);
    const thin = { ...edition("most-affordable", brisbane), eligible: 17, citySuburbs: 196 };
    expect(noEditionReason(thin)).toBe("We publish a figure drawn from many suburbs only when at least 30 suburbs and a fifth of Greater Brisbane's 196 suburbs of 1,000 or more residents have a published median; only 17 do. Ten suburbs from so few would not stand for the city.");
    expect(noEditionReason({ ...edition("most-affordable", brisbane), eligible: 120, citySuburbs: 400 })).toBeNull();
    expect(noEditionReason({ ...edition("for-families", brisbane, 4), citySuburbs: null })).toBe("A city edition needs 10 suburbs to show, and only 4 in Greater Brisbane qualify on the rules below.");
  });
  it("the cheapest list screens out CBD cores and apartment markets (review of 10 Oct 2026, 0.2a)", () => {
    const service = read("src/lib/services/city-rankings-service.ts");
    expect(service).toContain("const kept = rows.filter((r) => passesHouseScreens(r, rents.get(r.slug)?.house));");
    expect(service).toContain("return (await screenedAffordable(city)).slice(0, CITY_EDITION_POOL);");
    expect(service).toContain("return (await screenedAffordable(city)).length;");
    expect(cityEditionMethod(edition("most-affordable", getCapitalCity("melbourne")!)).join(" ")).toContain("CBD-core postcodes and suburbs whose house median looks like an apartment market's are left out");
  });
  it("the page and the city sitemap read the predicate, from the same list", () => {
    const page = read("src/app/(marketing)/best-suburbs/[category]/[state]/page.tsx");
    expect(page).toContain("robots: isCityEditionIndexable(category, city.state, edition.suburbs.length, editionCoverage(edition)) ? undefined : { index: false, follow: true },");
    // and the state pages keep theirs
    expect(page).toContain("robots: isRanked(category, upperState) ? undefined : { index: false, follow: true },");
    const sitemap = read("src/app/(marketing)/best-suburbs/cities/sitemap.ts");
    expect(sitemap).toContain("getIndexableCityEditions()");
    expect(sitemap).toContain('export const dynamic = "force-dynamic"');
    const service = read("src/lib/services/city-rankings-service.ts");
    // the sitemap list runs the page's own rows query and the page's own predicate on it
    expect(service).toContain("const edition = await fetchCityEdition(category, city);\n        if (isCityEditionIndexable(category, city.state, edition.suburbs.length, editionCoverage(edition))) out.push({ category, citySlug: city.slug });");
    expect(service).toContain("const rows = await fetchRows(category, city);\n  const eligible");
    expect(service).toContain("suburbs: rows.map((r) => r.suburb)");
    expect(read("src/app/sitemap.xml/route.ts")).toContain("/best-suburbs/cities/sitemap.xml");
  });
  it("the state pages and the category pages link only to editions on that list", () => {
    for (const f of ["src/app/(marketing)/best-suburbs/[category]/[state]/page.tsx", "src/app/(marketing)/best-suburbs/[category]/page.tsx"]) {
      expect(read(f), f).toContain("cityEditionLinks(await indexableCityEditionsForLinks()");
    }
    expect(read("src/components/best-suburbs/BestSuburbsListing.tsx")).toContain("cityEditions.map((e) =>");
  });
  it("the queries apply the published-medians rule, the locality filter and no Promise.all", () => {
    const service = read("src/lib/services/city-rankings-service.ts");
    expect(service).toContain("...PUBLISHED_GROWTH");
    expect(service).toContain("...PUBLISHED_HOUSE_MEDIAN,");
    // the inverted-median rule in the database filters (published-medians.notInvertedMedians)
    expect(service.match(/\.\.\.notInvertedMedians\(db\.suburb\.fields\.medianHousePrice\)/g)).toHaveLength(2);
    expect(read("src/app/(marketing)/price-guide/page.tsx")).toContain("...notInvertedMedians(db.suburb.fields.medianHousePrice),");
    expect(service).toContain("publishedSales(row)");
    expect(service).toContain("LOCALITIES_ONLY");
    expect(service).toContain("isNonLocalitySlug(r.slug)");
    expect(service).not.toContain("Promise.all");
    expect(service).not.toMatch(/medianHousePrice: \{ gt: 0 \}/);
    expect(service).not.toMatch(/isReliableSalesSource|isPlausibleAnnualGrowth/);
    // growth is fetched only where a feed measures it; hazard is never read
    expect(service).toContain("if (!isCityEditionCategory(category) || !isRanked(category, city.state)) return [];");
    expect(service).not.toMatch(/suburbHazard|floodClass/);
  });
});

describe("the cheapest editions date their medians and give the official city figure (review 0.2c, 3.2)", () => {
  it("puts the data period in the first sentence", () => {
    expect(cityEditionLede(edition("most-affordable", perth))).toMatch(/^By published median house price \(medians for 2024\), the ten cheapest Greater Perth suburbs are Suburb 1/);
  });
  it("prints Metropolitan Adelaide's Valuer-General median in the method, and none where unverified", () => {
    const adelaide = getCapitalCity("adelaide")!;
    const m = cityEditionMethod(edition("most-affordable", adelaide, 15, () => ({ state: "SA", medianBasis: "suburb" }))).join(" ");
    expect(m).toContain("For context, metropolitan Adelaide's median house sale price was $975,000 in the June 2026 quarter (SA Valuer-General): a median of every house sale, not of suburb medians.");
    expect(cityEditionMethod(edition("most-affordable", getCapitalCity("melbourne")!)).join(" ")).not.toContain("For context");
  });
});

describe("most walkable: a tie at the capped score is not a ranking (review of 10 Oct 2026, 0.1a)", () => {
  const capped = edition("most-walkable", sydney, 15, () => ({ state: "NSW", medianBasis: "suburb", walkScore: 100 }));
  const tied = { ...capped, atCap: 212 };
  it("the walkable editions answer noindex and stay out of the city sitemap while the score caps", () => {
    for (const city of CAPITAL_CITIES) {
      expect(isCityEditionIndexable("most-walkable", city.state, CITY_EDITION_POOL), city.slug).toBe(false);
      expect(hasCityEdition("most-walkable", city.state, CITY_EDITION_POOL), city.slug).toBe(true);
    }
    const wide = { pool: 300, suburbs: 400 };
    for (const c of CITY_EDITION_CATEGORIES.filter((c) => c !== "most-walkable")) {
      for (const city of CAPITAL_CITIES) expect(isCityEditionIndexable(c, city.state, CITY_EDITION_POOL, wide)).toBe(hasCityEdition(c, city.state, CITY_EDITION_POOL, wide));
    }
  });
  it("lists the suburbs at 100 unnumbered and says why", () => {
    expect(tiedAtCap(tied)).toHaveLength(10);
    expect(tied.suburbs.every((s) => !isNumbered("most-walkable", s))).toBe(true);
    expect(isNumbered("most-walkable", suburb({ walkScore: 98 }))).toBe(true);
    expect(isNumbered("most-affordable", suburb({ walkScore: 100 }))).toBe(true);
    const lede = cityEditionLede(tied);
    expect(lede).toContain("212 Greater Sydney suburbs of 1,000 or more residents reach it, so it cannot rank them. Listed alphabetically, the first ten are Suburb 1");
    expect(lede).not.toMatch(/most walkable Greater/);
    const method = cityEditionMethod(tied).join(" ");
    expect(method).toContain("These suburbs all score 100; listed alphabetically.");
    expect(method).toContain("within 1 km of the suburb's postcode centroid, capped at 100");
    expect(method).not.toMatch(/transport stops and pedestrian|Ranked by walk score/);
    const p = suburbParagraph(tied, tied.suburbs[3], 4);
    expect(p).toContain("Its walk score is 100 out of 100, the maximum, shared with 211 other Greater Sydney suburbs");
    expect(p).not.toMatch(/4th|highest/);
    const faq = cityEditionFaqs(tied).find((f) => f.question.startsWith("Which are the most walkable"))!;
    expect(faq.answer).toContain("The walk score cannot say: 212 Greater Sydney suburbs");
    expect(faq.answer).not.toMatch(/exceptional|out of 100\)/);
    expect(cityEditionDescription(tied)).toMatch(/^Greater Sydney suburbs by walk score, ties at the 100 cap listed alphabetically/);
  });
  it("numbers the suburbs below the cap after the tied ones", () => {
    const mixed = { ...edition("most-walkable", perth, 15, (i) => ({ state: "WA", walkScore: i < 3 ? 100 : 96 - i })), atCap: 3 };
    expect(tiedAtCap(mixed).map((s) => s.name)).toEqual(["Suburb 1", "Suburb 2", "Suburb 3"]);
    expect(cityEditionLede(mixed)).toBe("Suburb 1, Suburb 2 and Suburb 3 all score the maximum walk score of 100, listed alphabetically; after them, by walk score, come Suburb 4, Suburb 5, Suburb 6, Suburb 7, Suburb 8, Suburb 9 and Suburb 10.");
    expect(suburbParagraph(mixed, mixed.suburbs[3], 4)).toContain("Its walk score is 93 out of 100, the 4th highest in Greater Perth");
  });
  it("the page shows no rank or ItemList for tied suburbs", () => {
    const page = read("src/components/best-suburbs/CityEdition.tsx");
    expect(page).toContain("{full && tied.length === 0 && (");
    expect(page).toContain("{isNumbered(category, s) && <span");
    expect(page).toContain("{isNumbered(category, s) ? i + 1 : \"\"}");
  });
});

describe("city membership", () => {
  it("the Prisma filter and the SQL clause agree with capitalCityFor", () => {
    const samples: [string, string, string | null][] = [
      ["QLD", "4506", "brisbane"], ["QLD", "4000", "brisbane"], ["QLD", "4207", "brisbane"], ["QLD", "4300", "brisbane"],
      ["QLD", "4217", null], ["QLD", "4870", null], ["NSW", "2000", "sydney"], ["NSW", "2250", null], ["NSW", "2560", "sydney"],
      ["WA", "6000", "perth"], ["WA", "6210", "perth"], ["WA", "6211", null], ["VIC", "3000", "melbourne"], ["VIC", "3350", null],
      ["SA", "5000", "adelaide"], ["TAS", "7000", "hobart"], ["ACT", "2600", "canberra"], ["NT", "0800", "darwin"], ["NT", "0870", null],
    ];
    for (const [state, postcode, expected] of samples) {
      const city = capitalCityFor(state, postcode);
      expect(city?.slug ?? null, `${state} ${postcode}`).toBe(expected);
      for (const c of CAPITAL_CITIES) {
        const w = cityPostcodeWhere(c);
        const inWhere = w.state === state && w.OR.some((o) => postcode >= o.postcode.gte && postcode <= o.postcode.lte);
        expect(inWhere, `${c.slug} where ${state} ${postcode}`).toBe(c.slug === expected);
      }
    }
    // the SQL clause is the same ranges, zero-padded, on the alias
    expect(cityPostcodeSql(perth)).toBe("s.state = 'WA' AND ((s.postcode >= '6000' AND s.postcode <= '6175') OR (s.postcode >= '6210' AND s.postcode <= '6210'))");
    expect(cityPostcodeSql(getCapitalCity("darwin")!, "x")).toBe("x.state = 'NT' AND ((x.postcode >= '0800' AND x.postcode <= '0832'))");
    expect(cityPostcodeWhere(getCapitalCity("darwin")!).OR).toEqual([{ postcode: { gte: "0800", lte: "0832" } }]);
  });
  it("the city rollup reads the same filter", () => {
    expect(read("src/lib/services/city-market-service.ts")).toContain("...cityPostcodeWhere(city),");
  });
  it("measures the distance to the GPO from the centroid, and prints none without one", () => {
    // Brisbane GPO to Morayfield's centroid is a little over 40 km.
    const km = kmToCbd(brisbane, { lat: -27.1, lng: 152.95 });
    expect(km).toBeGreaterThan(38);
    expect(km).toBeLessThan(44);
    expect(kmToCbd(brisbane, { lat: null, lng: null })).toBeNull();
    expect(distanceKm(sydney.cbd, sydney.cbd)).toBe(0);
    // Sydney GPO to Melbourne GPO is about 714 km
    expect(Math.round(distanceKm(sydney.cbd, getCapitalCity("melbourne")!.cbd))).toBeGreaterThan(700);
    expect(Math.round(distanceKm(sydney.cbd, getCapitalCity("melbourne")!.cbd))).toBeLessThan(730);
    for (const c of CAPITAL_CITIES) {
      expect(c.cbd.lat, c.slug).toBeLessThan(-10);
      expect(c.cbd.lng, c.slug).toBeGreaterThan(110);
    }
  });
});

describe("titles and descriptions", () => {
  it("title and H1 are in the searched form, under 60 characters, with no figure", () => {
    for (const c of CITY_EDITION_CATEGORIES) {
      for (const city of CAPITAL_CITIES) {
        const t = cityEditionTitle(c, city);
        expect(t.length, t).toBeLessThanOrEqual(60);
        expect(t).not.toMatch(/\$/);
        expect(t).toContain(city.name);
        expect(t).toContain("2026");
        expect(cityEditionH1(c, city)).toBe(t);
        expect(t).not.toMatch(/^The for /);
      }
    }
    expect(cityEditionTitle("best-rental-yield", brisbane)).toBe("Best Suburbs to Invest in Brisbane 2026: Rental Yield");
    expect(cityEditionTitle("for-families", perth)).toBe("Best Suburbs for Families in Perth 2026");
    expect(cityEditionTitle("most-affordable", brisbane)).toBe("Cheapest Suburbs in Brisbane 2026");
    expect(cityEditionTitle("highest-growth", sydney)).toBe("Fastest Growing Suburbs in Sydney 2026");
    expect(cityEditionTitle("most-walkable", getCapitalCity("melbourne")!)).toBe("Most Walkable Suburbs in Melbourne 2026");
    expect(cityEditionPath("best-rental-yield", "brisbane")).toBe("/best-suburbs/best-rental-yield/brisbane");
  });
  it("descriptions fit 160 characters with the longest names and promise no figure", () => {
    const long = (i: number) => ({ name: ["Karratha Industrial Estate", "Catherine Hill Bay", "Upper Caboolture", "Surfers Paradise"][i % 4] });
    for (const c of CITY_EDITION_CATEGORIES) {
      for (const city of CAPITAL_CITIES) {
        const d = cityEditionDescription(edition(c, city, 10, long));
        expect(d.length, d).toBeLessThanOrEqual(160);
        // no price and no measured figure; the family list's 40% is its rule, not a figure
        expect(d).not.toMatch(/\$|\d+\.\d+%/);
        expect(d.replace("40% or more", "")).not.toMatch(/%/);
        expect(d).toContain(city.name);
      }
    }
    expect(cityEditionDescription(edition("best-rental-yield", brisbane, 10, (i) => ({ name: ["Morayfield", "Caboolture", "Kallangur"][i] ?? `S${i}` })))).toBe(
      "Ten Greater Brisbane suburbs ranked by gross rental yield on published medians and bond rents: Morayfield, Caboolture and Kallangur. Method, table and FAQ.",
    );
  });
  it("the lede names the ten", () => {
    const lede = cityEditionLede(edition("for-families", perth));
    expect(lede).toContain("among Greater Perth suburbs where family households are at least 40% of households (2021 Census), the ten that rank highest are Suburb 1, Suburb 2");
    expect(lede).toContain("Suburb 9 and Suburb 10.");
    expect(lede).not.toContain("Suburb 11");
  });
});

describe("the family criterion says what it measures (review of 10 Oct 2026, 0.1b)", () => {
  it("calls the 2021 Census share family households, never families with dependants", () => {
    // householdsFamily is ABS G35 Total_FamHhold over all households: couples without children count.
    const e = edition("for-families", perth, 15, () => ({ state: "WA" }));
    const all = [
      cityEditionLede(e),
      cityEditionDescription(e),
      ...cityEditionMethod(e),
      ...e.suburbs.map((s, i) => suburbParagraph(e, s, i + 1)),
      ...e.suburbs.map((s) => metricSummary("for-families", s) ?? ""),
      ...cityEditionFaqs(e).map((f) => f.answer),
      ...cityEditionFaqs(edition("most-affordable", brisbane)).map((f) => f.answer),
      ...edition("most-affordable", brisbane).suburbs.map((s, i) => suburbParagraph(edition("most-affordable", brisbane), s, i + 1)),
    ].join(" ");
    expect(all).not.toMatch(/dependants|dependents|families are \d|families with/i);
    expect(all).toContain("family households are at least 40% of households");
    expect(cityEditionMethod(e).join(" ")).toContain("couples without children count");
    for (const f of ["src/lib/data/category-commentary.ts", "src/components/best-suburbs/BestSuburbsListing.tsx", "src/app/(marketing)/best-suburbs/page.tsx"]) {
      expect(read(f), f).not.toMatch(/families with dependen|Population-weighted|highest-rated schools/);
    }
  });
});

describe("what the page prints", () => {
  it("the method names the data, its period, who is in and how distance is measured", () => {
    const m = cityEditionMethod(edition("best-rental-yield", brisbane));
    expect(m.join(" ")).toContain("Ranked by gross rental yield, highest first, from 120 Greater Brisbane suburbs");
    expect(m.join(" ")).toContain("ABS statistical-area (SA2) medians");
    expect(m.join(" ")).toContain("The medians are for 2024.");
    expect(m.join(" ")).toContain("Queensland RTA bond data, June 2026 period");
    expect(m.join(" ")).toContain("These ABS medians come without a 12-month change");
    expect(m.join(" ")).toContain("postcodes 4000 to 4207, 4300 to 4306, 4500 to 4521");
    expect(m.join(" ")).toContain("straight line from the suburb's postcode centroid to the Brisbane GPO");
    const g = cityEditionMethod(edition("highest-growth", sydney)).join(" ");
    expect(g).toContain("NSW Valuer General");
    expect(g).toContain("The medians are for calendar 2025.");
    expect(g).toContain("A change beyond 25% in a year is left out");
    expect(cityEditionMethod(edition("for-families", perth)).join(" ")).toContain("a dash means none is published");
    for (const line of m) expect(line).not.toMatch(/—|–/);
    // never a 0 as a figure: a city with nothing qualifying names no count
    const empty = cityEditionMethod({ ...edition("most-affordable", getCapitalCity("darwin")!, 0), eligible: 0 });
    expect(empty[0]).toContain("from the Greater Darwin suburbs with a published median");
    expect(empty.join(" ")).not.toMatch(/\b0 Greater/);
  });
  it("a suburb paragraph prints only published figures, never a 0, and growth only where measured", () => {
    const e = edition("best-rental-yield", brisbane);
    const p = suburbParagraph(e, suburb({}), 3);
    expect(p).toBe("Morayfield (4506) is about 40 km from the Brisbane CBD. The median house price is $660,000 (the ABS statistical-area median for the area that carries its name) and the latest median house rent from Queensland RTA bond data is $520 a week, a gross yield of 4.1%, the 3rd highest in Greater Brisbane. 25,000 people lived there at the 2021 Census.");
    // no centroid, no distance; no growth, no growth sentence
    expect(suburbParagraph(e, suburb({ kmToCbd: null }), 1)).toMatch(/^Morayfield \(4506\) is in Greater Brisbane\./);
    expect(suburbParagraph(e, suburb({ annualGrowthHouse: 0 }), 1)).not.toMatch(/year earlier/);
    // a measured change prints, up or down
    const nsw = edition("most-affordable", sydney);
    expect(suburbParagraph(nsw, suburb({ state: "NSW", medianBasis: "suburb", annualGrowthHouse: -3.2, walkScore: 0 }), 2)).toContain("The median is down 3.2% on a year earlier.");
    expect(suburbParagraph(nsw, suburb({ state: "NSW", medianBasis: "suburb", annualGrowthHouse: 6, walkScore: 55 }), 2)).toContain("the 2nd lowest published median in Greater Sydney. The median is up 6.0% on a year earlier. Walk score 55 out of 100. 25,000 people lived there at the 2021 Census, and family households are 62% of households.");
    // a family suburb without a published median says so instead of printing $0
    const fam = suburbParagraph(edition("for-families", perth), suburb({ medianHousePrice: 0, medianBasis: null, state: "WA" }), 1);
    expect(fam).toContain("The six schools we hold for the suburb average an ICSEA of 980 (ACARA), the highest in Greater Perth");
    expect(suburbParagraph(edition("for-families", perth), suburb({ schoolCount: 1, avgSchoolIcsea: 1150 }), 4)).toContain("The one school we hold for the suburb has an ICSEA of 1150 (ACARA), the 4th highest in Greater Perth");
    expect(fam).toContain("No house median is published for it yet.");
    expect(fam).not.toMatch(/\$0\b/);
    // population 0 prints nothing
    expect(suburbParagraph(e, suburb({ population: 0 }), 1)).not.toContain("Census");
    expect(suburbParagraph(edition("most-walkable", perth), suburb({ walkScore: 92, medianHousePrice: 0, medianBasis: null }), 1)).toContain("Its walk score is 92 out of 100, the highest in Greater Perth");
    expect(suburbParagraph(edition("highest-growth", sydney), suburb({ annualGrowthHouse: 12.5, medianBasis: "suburb" }), 1)).toContain("The median house price rose 12.5% over 12 months to $660,000, the largest rise in Greater Sydney");
    expect(metricSummary("best-rental-yield", suburb({}))).toBe("Gross yield 4.1%, median $660,000, rent $520 a week");
    expect(metricSummary("most-affordable", suburb({ medianHousePrice: 0 }))).toBeUndefined();
  });
  it("the under-$500,000 section only where the data supports it, and never on the cheapest list", () => {
    const none = edition("best-rental-yield", brisbane, 15, () => ({ medianHousePrice: 700_000 }));
    expect(underBudget(none)).toEqual([]);
    expect(showUnderBudget(none)).toBe(false);
    const two = edition("best-rental-yield", brisbane, 15, (i) => ({ medianHousePrice: i < 2 ? 450_000 : 700_000 }));
    expect(showUnderBudget(two)).toBe(false);
    const some = edition("best-rental-yield", brisbane, 15, (i) => ({ medianHousePrice: i % 3 === 0 ? 450_000 : 700_000 }));
    expect(underBudget(some).map((s) => s.name)).toEqual(["Suburb 1", "Suburb 4", "Suburb 7", "Suburb 10", "Suburb 13"]);
    expect(showUnderBudget(some)).toBe(true);
    // an unpublished median (0) is never "under budget"
    expect(underBudget(edition("for-families", perth, 15, () => ({ medianHousePrice: 0 })))).toEqual([]);
    expect(showUnderBudget(edition("most-affordable", brisbane, 15, () => ({ medianHousePrice: 300_000 })))).toBe(false);
  });
});

describe("the FAQ answers the People Also Ask from the data", () => {
  const editions: CityEdition[] = [
    edition("best-rental-yield", brisbane),
    edition("best-rental-yield", getCapitalCity("melbourne")!, 15, () => ({ state: "VIC", medianBasis: "suburb", rentSource: "rental-vic" })),
    edition("highest-growth", sydney, 15, (i) => ({ state: "NSW", medianBasis: "suburb", annualGrowthHouse: 20 - i, medianHousePrice: 900_000 + i * 10_000 })),
    edition("for-families", perth, 15, () => ({ state: "WA" })),
    edition("for-families", perth, 15, () => ({ state: "WA", medianHousePrice: 0, medianBasis: null })),
    edition("most-affordable", sydney, 15, (i) => ({ state: "NSW", medianBasis: "suburb", annualGrowthHouse: i % 2 ? 4.2 : -1.5, medianHousePrice: 480_000 + i * 20_000 })),
    edition("most-affordable", brisbane, 15, (i) => ({ medianHousePrice: 480_000 + i * 20_000 })),
    edition("most-walkable", perth, 15, () => ({ state: "WA" })),
  ];
  it("every answer is 40 words or more, carries a figure, names no forecast and uses no em-dash", () => {
    for (const e of editions) {
      const faqs = cityEditionFaqs(e);
      expect(faqs.length, `${e.category} ${e.city.slug}`).toBeGreaterThanOrEqual(3);
      for (const f of faqs) {
        expect(words(f.answer), `${e.category} ${e.city.slug}: ${f.question}`).toBeGreaterThanOrEqual(40);
        expect(f.answer, f.question).toMatch(/\d/);
        expect(f.answer, f.question).not.toMatch(/—/);
        // the question may be echoed in a refusal ("We do not predict which suburbs will boom"); nothing else forecasts
        expect(f.answer.replace(/which suburbs will boom/gi, ""), f.question).not.toMatch(/\bwill (boom|rise|grow|double|outperform)\b/i);
        expect(f.answer, f.question).not.toMatch(/\$0\b|\b0\.0%/);
        expect(f.question).not.toMatch(/—/);
      }
    }
  });
  it("makes no hazard claim and no claim nothing measures", () => {
    for (const e of editions) {
      for (const f of cityEditionFaqs(e)) {
        expect(f.answer, f.question).not.toMatch(/flood|bushfire|hazard/i);
        expect(f.answer, f.question).not.toMatch(/typical suburb|revert|drift back/i);
        expect(f.answer, f.question).not.toMatch(/\b1st\b|\b\d+ of the ten\b/);
      }
    }
  });
  it("answers the PAA of 'best suburbs to invest in brisbane'", () => {
    const qs = cityEditionFaqs(editions[0]).map((f) => f.question);
    expect(qs).toContain("What are the best suburbs in Brisbane to invest in for $500,000 or less?");
    expect(qs).toContain("Which Brisbane suburbs are undervalued?");
    expect(qs).toContain("Which suburbs will boom in Brisbane in 2026?");
    expect(qs).toContain("Which Brisbane suburbs have the highest rental yields?");
  });
  it("answers the PAA of 'best suburbs in perth'", () => {
    const qs = cityEditionFaqs(editions[3]).map((f) => f.question);
    expect(qs).toContain("What suburbs should I stay away from in Perth?");
    expect(qs).toContain("Which suburbs will boom in Perth in 2026?");
    expect(qs).toContain("What are the best suburbs in Perth for families?");
  });
  it("'will boom' gets what the data shows: no growth figure where none is measured, the measured rises where one is", () => {
    const qld = cityEditionFaqs(editions[0]).find((f) => f.question.startsWith("Which suburbs will boom"))!;
    expect(qld.answer).toContain("We do not predict which suburbs will boom");
    expect(qld.answer).toContain("we hold no growth figure to rank Brisbane suburbs on");
    expect(qld.answer).toContain("ABS statistical-area (SA2) medians for 2024, and they come without a 12-month change");
    const nsw = cityEditionFaqs(editions[2]).find((f) => f.question.startsWith("Which suburbs will boom"))!;
    expect(nsw.answer).toContain("the largest measured rises over the last 12 months were Suburb 1 (+20.0%), Suburb 2 (+19.0%) and Suburb 3 (+18.0%)");
    expect(nsw.answer).toContain("for calendar 2025");
  });
  it("the budget answer lists the suburbs under $500,000 or says there are none", () => {
    const none = cityEditionFaqs(editions[0]).find((f) => f.question.includes("$500,000"))!;
    expect(none.answer).toContain("None of the 15 Greater Brisbane suburbs at the top of this ranking has a published median house price under $500,000.");
    expect(none.answer).toContain("The lowest among them is Suburb 1 at $660,000");
    expect(none.answer).not.toMatch(/linked below/);
    // every suburb under the budget is named, and the count matches the list
    const six = cityEditionFaqs(edition("best-rental-yield", brisbane, 15, (i) => ({ medianHousePrice: i < 6 ? 450_000 + i * 1000 : 700_000 }))).find((f) => f.question.includes("$500,000"))!;
    expect(six.answer).toContain("six have a published median house price under $500,000: Suburb 1 ($450,000), Suburb 2 ($451,000), Suburb 3 ($452,000), Suburb 4 ($453,000), Suburb 5 ($454,000) and Suburb 6 ($455,000).");
    // on the cheapest list, none under the budget is a statement about the whole city
    const syd = cityEditionFaqs(edition("most-affordable", sydney, 15, (i) => ({ state: "NSW", medianBasis: "suburb", medianHousePrice: 900_000 + i * 1000 }))).find((f) => f.question.includes("$500,000"))!;
    expect(syd.answer).toContain("No Greater Sydney suburb of 1,000 or more residents has a published median house price under $500,000. The lowest is Suburb 1 at $900,000.");
    const some = cityEditionFaqs(editions[6]).find((f) => f.question.includes("$500,000"))!;
    expect(some.question).toBe("Where can I buy a house in Brisbane for under $500,000?");
    expect(some.answer).toContain("one has a published median house price under $500,000: Suburb 1 ($480,000)");
  });
  it("a family list with no published median says so rather than printing a price", () => {
    const f = cityEditionFaqs(editions[4]).find((q) => q.question.startsWith("How much does a house cost"))!;
    expect(f.answer).toContain("None of the ten suburbs on this page has a published median house price yet.");
    const priced = cityEditionFaqs(editions[3]).find((q) => q.question.startsWith("How much does a house cost"))!;
    expect(priced.answer).toContain("All ten suburbs on this page have a published median house price, from $660,000 in Suburb 1");
  });
  it("the cheapest list says whether its suburbs rose where a change is measured, and that it cannot where none is", () => {
    const nsw = cityEditionFaqs(editions[5]).find((f) => f.question.startsWith("Are Sydney"))!;
    expect(nsw.answer).toContain("all ten have a measured 12-month change and five of those rose");
    expect(nsw.answer).toContain("+4.2%");
    const qld = cityEditionFaqs(editions[6]).find((f) => f.question.startsWith("Are Brisbane"))!;
    expect(qld.answer).toContain("These ABS medians come without a 12-month change");
    expect(qld.answer).toContain("cannot say whether the cheapest suburbs rose or fell");
  });
});
