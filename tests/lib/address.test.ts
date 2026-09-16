// Google Places address field on the appraisal forms: parsing and suburb matching.
import { describe, expect, it } from "vitest";
import { guessSuburbSlug, matchSuburb, parsePlaceAddress, type PlaceAddressComponent } from "@/lib/address";

const bondi: PlaceAddressComponent[] = [
  { longText: "15", shortText: "15", types: ["street_number"] },
  { longText: "Smith Street", shortText: "Smith St", types: ["route"] },
  { longText: "Bondi", shortText: "Bondi", types: ["locality", "political"] },
  { longText: "New South Wales", shortText: "NSW", types: ["administrative_area_level_1", "political"] },
  { longText: "Australia", shortText: "AU", types: ["country", "political"] },
  { longText: "2026", shortText: "2026", types: ["postal_code"] },
];

describe("parsePlaceAddress", () => {
  it("builds the street line, suburb, state code, postcode and the stored full address", () => {
    const p = parsePlaceAddress(bondi)!;
    expect(p).toEqual({ streetLine: "15 Smith Street", suburb: "Bondi", state: "NSW", postcode: "2026", full: "15 Smith Street, Bondi NSW 2026" });
  });
  it("puts a unit number in front of the street number", () => {
    const p = parsePlaceAddress([{ longText: "2", shortText: "2", types: ["subpremise"] }, ...bondi])!;
    expect(p.streetLine).toBe("2/15 Smith Street");
    expect(p.full).toBe("2/15 Smith Street, Bondi NSW 2026");
  });
  it("returns null without a suburb or postcode, so the form falls back to free text", () => {
    expect(parsePlaceAddress(bondi.filter((c) => !c.types.includes("postal_code")))).toBeNull();
    expect(parsePlaceAddress(bondi.filter((c) => !c.types.includes("locality")))).toBeNull();
  });
});

describe("suburb slug matching", () => {
  it("guesses the site's slug form, including apostrophes and spaces", () => {
    expect(guessSuburbSlug("St Kilda", "VIC", "3182")).toBe("st-kilda-vic-3182");
    expect(guessSuburbSlug("O'Connor", "ACT", "2602")).toBe("oconnor-act-2602");
    expect(guessSuburbSlug("Hawthorn East", "vic", "3123")).toBe("hawthorn-east-vic-3123");
  });
  it("matches the exact slug first, then a name match within the postcode, else null", () => {
    const hits = [
      { slug: "bondi-beach-nsw-2026", name: "Bondi Beach", state: "NSW", postcode: "2026" },
      { slug: "bondi-nsw-2026", name: "Bondi", state: "NSW", postcode: "2026" },
    ];
    const p = parsePlaceAddress(bondi)!;
    expect(matchSuburb(p, hits)?.slug).toBe("bondi-nsw-2026");
    expect(matchSuburb({ ...p, suburb: "BONDI" }, hits.filter((h) => h.slug !== "bondi-nsw-2026").concat([{ slug: "bondi-x-nsw-2026", name: "Bondi", state: "NSW", postcode: "2026" }]))?.slug).toBe("bondi-x-nsw-2026");
    expect(matchSuburb({ ...p, suburb: "Nowhere" }, hits)).toBeNull();
  });
});
